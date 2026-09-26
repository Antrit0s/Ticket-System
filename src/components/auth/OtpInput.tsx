import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function OtpInput({ value, onChange }: Props) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Keep six controlled boxes even while the code is still short.
  const otpArray = value.split("").slice(0, 6);
  while (otpArray.length < 6) {
    otpArray.push("");
  }

  const handleInputChange = (index: number, value: string) => {
    // Keep only digits — inputMode isn't enforced on every browser.
    const numericValue = value.replace(/[^0-9]/g, "");
    if (!numericValue && value !== "") return; // backspace

    const newOtpArray = [...otpArray];
    newOtpArray[index] = numericValue.slice(-1); // keep only the last digit

    const newValue = newOtpArray.join("");
    onChange(newValue);

    // Auto-advance to the next box after typing.
    if (numericValue && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      if (!otpArray[index] && index > 0) {
        // Backspace on an empty box clears the previous digit.
        const newOtpArray = [...otpArray];
        newOtpArray[index - 1] = "";
        onChange(newOtpArray.join(""));
        inputsRef.current[index - 1]?.focus();
      } else if (otpArray[index]) {
        // Clear the current digit.
        const newOtpArray = [...otpArray];
        newOtpArray[index] = "";
        onChange(newOtpArray.join(""));
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const pastedText = event.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);
    if (pastedText) {
      onChange(pastedText);
      // Jump to the next empty box after pasting.
      const nextIndex = Math.min(pastedText.length, 5);
      inputsRef.current[nextIndex]?.focus();
    }
  };

  const renderInputBox = (index: number) => {
    return (
      <input
        key={index}
        ref={(element) => {
          inputsRef.current[index] = element;
        }}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={otpArray[index]}
        onChange={(event) => handleInputChange(index, event.target.value)}
        onKeyDown={(event) => handleKeyDown(index, event)}
        onPaste={handlePaste}
        style={{
          width: "46px",
          height: "52px",
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "bold",
          border: "1px solid #ccc",
          borderRadius: "8px",
          outline: "none",
          backgroundColor: "transparent",
          color: "inherit",
        }}
      />
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography
        sx={{ fontWeight: "bold", fontSize: "14px", color: "text.primary" }}
      >
        OTP
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {renderInputBox(0)}
        {renderInputBox(1)}
        {renderInputBox(2)}
        <Typography
          variant="h6"
          sx={{ px: 0.5, fontWeight: "bold", color: "text.secondary" }}
        >
          :
        </Typography>
        {renderInputBox(3)}
        {renderInputBox(4)}
        {renderInputBox(5)}
      </Box>
    </Box>
  );
}
