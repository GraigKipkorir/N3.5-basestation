clear;

% loading data and giving variables
X = load("tanafull.csv");
int = 1; % also accounts for time in  millis
altitude = X(1:int:1000, 10);

%getiing number of rows and columns in id
[rows, columns] = size(altitude);
% Define the system dynamics matrices
A = [1.0, 0.1, 0.005;
     0, 1.0, 0.1;
     0, 0, 1.0];

% Define the relationship between measurement and states
H = [1.0, 0, 0;
     0, 0, 1.0];

% Define the initial posteriori estimate error covariance
P = eye(3);

% Define the measurement error covariance
R = [0.25, 0;
     0, 0.75];

% Define the process noise covariance
q = 0.0001;
Q = q * eye(3);

% Define the identity matrix
I = eye(3);

% Initialize the state vector
x_hat = [1500.0; 0.0; 0.0];

% Initialize the measurement vector
Z = [0.0; 0.0];

% Initialize the filtered acceleration
filtered_parameter = [];

% Measurement noise standard deviation
measurement_noise_std = sqrt(R(2, 2));

% Simulated measurement data (you should replace this with your real data)
% assign simulated paramter to parameter that needs to be plotted
simulated_parameter = altitude;  % data with noise

for t = 1:rows
    % Update the measurement with the simulated data
    Z(2) = simulated_parameter(t);
    
    % Prediction Step
    x_hat_minus = A * x_hat;
    P_minus = A * P * A' + Q;

    % Update Step (Kalman Gain Calculation)
    con = H * P_minus * H' + R;
    K = P_minus * H' / con;

    % Measurement Residual
    Y = Z - H * x_hat_minus;

    % Update the State Estimate
    x_hat = x_hat_minus + K * Y;

    % Update the Estimate Covariance
    P = (I - K * H) * P_minus;

    % Store the filtered paramater
    filtered_parameter(t) = x_hat(3);
end

% Plot the filtered parameter and replace parameter accordingly
figure;
plot(1:rows, filtered_parameter, '-b', 1:rows, altitude, '-r')
xlabel('Time Step');
ylabel('Altitude');
legend('filtered altitude', 'raw altitude')
title('Kalman Filtered Altitude');
grid on;

