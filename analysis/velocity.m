clear;

% loading data and giving variables
X = load("drone_flight.csv");
id = X(1:50:1000,2); % also accounts for time in  millis
velocity = X(1:50:1000, 11);

% plotting data from the flight
plot(id, velocity, '-r')
xlabel('id')
ylabel('velocity')
title('velocity against time')
legend('velocity')