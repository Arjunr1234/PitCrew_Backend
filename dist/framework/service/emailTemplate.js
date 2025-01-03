"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerRejectionTemplate = exports.otpTemplate = void 0;
//otp template
const otpTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; background: #f4f4f9; padding: 30px; text-align: center;">
    <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);">
      <h1 style="font-size: 24px; font-weight: bold; color: #333;">Pitcrew</h1>
      <p style="font-size: 16px; color: #555;">Hi,</p>
      <p style="font-size: 16px; color: #555;">Use the OTP below to complete your registration. This OTP is valid for one minute.</p>
      
      <div style="margin: 20px auto; display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; border-radius: 8px; font-size: 24px; font-weight: bold;">
        ${otp}
      </div>
      
      <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email.</p>
      <p style="font-size: 14px; color: #777;">Best regards,<br>PitCrew Team</p>
    </div>
    <footer style="margin-top: 20px; font-size: 12px; color: #999;">&copy; 2024 PitCrew. All rights reserved.</footer>
  </div>
`;
exports.otpTemplate = otpTemplate;
// rejection template;
const providerRejectionTemplate = (reason) => `
  <div style="font-family: Arial, sans-serif; background: #f4f4f9; padding: 30px; text-align: center;">
    <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);">
      <h1 style="font-size: 24px; font-weight: bold; color: #333;">Pitcrew</h1>
      <p style="font-size: 16px; color: #555;">Hello,</p>
      <p style="font-size: 16px; color: #555;">We regret to inform you that your provider application has been reviewed, and unfortunately, we are unable to approve your request at this time.</p>
      
      <div style="margin: 20px auto; display: inline-block; padding: 10px 20px; background-color: #FF4D4D; color: #fff; border-radius: 8px; font-size: 18px; font-weight: bold;">
        Request Rejected
      </div>
      
      <p style="font-size: 16px; color: #555;">Reason for Rejection:</p>
      <div style="margin: 20px auto; display: inline-block; padding: 15px 20px; background-color: #ffe6e6; color: #b30000; border-radius: 8px; font-size: 14px; font-weight: bold;">
        ${reason}
      </div>

      <p style="font-size: 14px; color: #777;">If you have any questions or would like to reapply in the future, please feel free to reach out to us. We appreciate your interest in joining PitCrew and encourage you to apply again at a later date.</p>
      
      <p style="font-size: 14px; color: #777;">Best regards,<br>PitCrew Team</p>
    </div>
    <footer style="margin-top: 20px; font-size: 12px; color: #999;">&copy; 2024 PitCrew. All rights reserved.</footer>
  </div>
`;
exports.providerRejectionTemplate = providerRejectionTemplate;
