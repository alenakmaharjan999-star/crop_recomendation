CREATE DATABASE CropDB;

CREATE TABLE Users (
    UserId       INT IDENTITY PRIMARY KEY,
    Email        NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    CreatedAt    DATETIME DEFAULT GETDATE()
);

CREATE TABLE PredictionHistory (
    PredictionId   INT IDENTITY PRIMARY KEY,
    UserId         INT NOT NULL,
    Nitrogen       FLOAT NOT NULL,
    Phosphorus     FLOAT NOT NULL,
    Potassium      FLOAT NOT NULL,
    Ph             FLOAT NOT NULL,
    Location       NVARCHAR(100) NOT NULL,
    Temperature    FLOAT NOT NULL,
    Humidity       FLOAT NOT NULL,
    Rainfall       FLOAT NOT NULL,
    PredictedCrop  NVARCHAR(100) NOT NULL,
    CreatedAt      DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Prediction_User FOREIGN KEY (UserId) REFERENCES Users(UserId)
);