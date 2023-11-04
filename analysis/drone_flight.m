clear;

% loading data and giving variables
X = load("drone_flight.csv");
id = X(1:50:1000,2); % also accounts for time in  millis
altitude = X(1:50:1000, 10);

% plotting data from the flight
plot(id, altitude, '-r')
xlabel('id')
ylabel('altitude')
title('altitude against id')
legend('altitude')
