const User=require('../../models/userModel/userModel');
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const sendEmail=require('../../config/email.js');

const registerUser = async (req,res)=>{
    try{
        const {name,email,password}=req.body;
        if( !name || ! email || !password){
            return res.status(400).json({
                message:'Please provide all required fields'
            });
        }
        const emailExists= await User.findOne({email});
        if(emailExists){
            return res.status(400).json({
                message:'Email already exists'
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            role: 'user'
        })
        res.status(201).json({
            message:'User registered successfully',
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });
    }catch(err){
        res.status(500).json({
            message:'Registration failed',
            error:err.message
        });
    }
}

const loginUser = async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            if(!email || !password){
                return res.status(400).json({
                    message:"Please provide both email and password"
                })
            }
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"Invalid email or password"
            })
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({
                message:"Invalid email or password"
            })
        }
        const token = jwt.sign({
            userId:user._id,
            role:user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:'1d'
        })
        res.status(200).json({
            message:"Login successful",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })
    }
    catch(err){
        res.status(500).json({
            message:"Login failed",
            error:err.message
        })
    }
}

const forgotPassword = async (req,res)=>{
    try{
        const {email}=req.body;
        if(!email){
            return res.status(400).json({
                message:"Please provide your email"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }
        const resetCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.resetPasswordCode = resetCode;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        await user.save();

        await sendEmail({
            to: user.email,
            subject: "TaskFlow Password Reset Code",

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                ">

                    <h2 style="color: #2563eb;">
                        TaskFlow Password Reset
                    </h2>

                    <p>Hello ${user.name},</p>

                    <p>
                        We received a request to reset your TaskFlow account password.
                    </p>

                    <p>
                        Your password reset code is:
                    </p>

                    <div style="
                        background: #eff6ff;
                        padding: 20px;
                        text-align: center;
                        border-radius: 8px;
                        margin: 20px 0;
                    ">
                        <h1 style="
                            color: #2563eb;
                            letter-spacing: 8px;
                            margin: 0;
                        ">
                            ${resetCode}
                        </h1>
                    </div>

                    <p>
                        This code will expire in <strong>15 minutes</strong>.
                    </p>

                    <p>
                        If you did not request a password reset,
                        you can safely ignore this email.
                    </p>

                    <p>
                        Regards,<br>
                        <strong>TaskFlow Team</strong>
                    </p>

                </div>
            `
        });
        res.status(200).json({
            message:"Password reset code sent successfully!"
        })
    }catch(err){
        res.status(500).json({
            message:"Forgot password failed",
            error:err.message
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, code, password } = req.body;

        if (!email || !code || !password) {
            return res.status(400).json({
                message: "Email, reset code and new password are required"
            });
        }

        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset code"
            });
        }

        user.password = await bcrypt.hash(password, 10);

        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            message: "Password reset successful"
        });

    } catch (err) {
        res.status(500).json({
            message: "Reset password failed",
            error: err.message
        });
    }
};

const verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                message: "Email and reset code are required"
            });
        }

        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset code"
            });
        }

        res.status(200).json({
            message: "Reset code verified successfully",
            email: user.email
        });

    } catch (err) {
        res.status(500).json({
            message: "Code verification failed",
            error: err.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json({
            message: "Profile fetched successfully",
            user
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching profile",
            error: err.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }
        const emailExists = await User.findOne({
            email,
            _id: { $ne: req.user.userId }
        });
        if (emailExists) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { name, email },
            { returnDocument: "after", runValidators: true }
        ).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json({
            message: "Profile updated successfully",
            user
        });
    } catch (err) {
        res.status(500).json({
            message: "Error updating profile",
            error: err.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "All password fields are required"
            });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "New password and confirm password do not match"
            });
        }
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
            message: "Password changed successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: "Error changing password",
            error: err.message
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        res.status(200).json({
            message: "Logout successful"
        });
    } catch (err) {
        res.status(500).json({
            message: "Logout failed",
            error: err.message
        });
    }
};

module.exports={registerUser,loginUser,forgotPassword,resetPassword,verifyResetCode,getProfile,updateProfile,changePassword,logoutUser};