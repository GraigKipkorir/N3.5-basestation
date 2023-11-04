clear;

% loading data and giving variables
X = load("drone_flight.csv");
id = X(1:50:1000,2); % also accounts for time in  millis
presure = X(1:50:1000, 12);

% plotting data from the flight
plot(id, presure, '-r')
xlabel('id')
ylabel('presure')
title('pressure against time')
legend('presure')