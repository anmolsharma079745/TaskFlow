const express=require('express');
const { registerUser, loginUser, forgotPassword, resetPassword, verifyResetCode, getProfile, updateProfile, changePassword, logoutUser }=require('../../controllers/authController/authController.js');
const authMiddleware = require("../../middleware/authMiddleware/authMiddleware.js")

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-reset-code', verifyResetCode);
router.get('/profile', authMiddleware, getProfile);
router.put('/update-profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);
router.post('/logout', authMiddleware, logoutUser);

module.exports=router;