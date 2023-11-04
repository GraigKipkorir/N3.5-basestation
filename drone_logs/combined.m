clear;

% loading data and giving variables
X = load("drone_flight.csv");
id = X(1:50:1000,2); % also accounts for time in  millis
altitude = X(1:50:1000, 10);
pressure = X(1:50:1000, 12);
%velocity = X(1:50:1000, 11);

% plotting data from the flight
plot(id, altitude, 'r-', id, pressure, 'b-')
xlabel('id')
ylabel('altitude')
title('altitude against id')
legend('altitude', 'pressure')