import userModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/email.service.js";
import { registerSuccessHtml, emailVerifiedHtml, alreadyVerifiedHtml } from "../utils/success.util.js";
import { verifySuccessPage, alreadyVerifiedPage, verifyErrorPage } from "../utils/verify-page.util.js";

// Register
const registerController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create new user
        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
        });

        // Generate email verification token (JWT, 24h expiry)
        const emailVerifyToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        // Build verify URL and send verification email (non-blocking)
        const verifyUrl = `${process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 3000}`}/api/auth/verify-email/${emailVerifyToken}`;

        sendEmail(
            newUser.email,
            "Verify Your Email - Pax AI",
            null,
            registerSuccessHtml(newUser, verifyUrl)
        ).catch((err) => console.error("Failed to send verification email:", err.message));

        // Generate auth JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // Set cookie and respond
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            message: "User registered successfully. Please verify your email.",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                verified: newUser.verified,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Verify Email
const verifyEmailController = async (req, res, next) => {
    try {
        const { token } = req.params;

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).send(verifyErrorPage("User not found"));
        }

        // Check if already verified
        if (user.verified) {
            sendEmail(
                user.email,
                "Already Verified - Pax AI",
                null,
                alreadyVerifiedHtml(user)
            ).catch((err) => console.error("Failed to send already verified email:", err.message));

            return res.status(200).send(alreadyVerifiedPage(user));
        }

        // Mark as verified
        user.verified = true;
        await user.save();

        // Send verified success email (non-blocking)
        sendEmail(
            user.email,
            "Email Verified Successfully! ✅",
            null,
            emailVerifiedHtml(user)
        ).catch((err) => console.error("Failed to send verified email:", err.message));

        res.status(200).send(verifySuccessPage(user));
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(400).send(verifyErrorPage("Verification link has expired"));
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(400).send(verifyErrorPage("Invalid verification link"));
        }
        res.status(500).send(verifyErrorPage("Something went wrong. Please try again."));
    }
};

// Login
const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // Set cookie and respond
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get Me (current user)
const getMeController = async (req, res, next) => {
    res.status(200).json({ user: req.user });
};

// Logout
const logoutController = async (req, res, next) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export { registerController, verifyEmailController, loginController, getMeController, logoutController };