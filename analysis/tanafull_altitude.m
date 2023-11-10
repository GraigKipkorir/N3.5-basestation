clear;

% loading data and giving variables
X = load("tanafull.csv");
int = 1;
c = 1400;
id = X(c:int:1831, 12); % also accounts for time in  millis
altitude = X(c:int:1831, 1);
filtered_altitude = X(c:int:1831,3);
% plotting data from the flight
figure;
plot(id, altitude, '-r', id, filtered_altitude, '-g')
xlabel('id')
ylabel('altitude (m)')
title('Altitude against Id')
legend('altitude', 'filtered_altitude')
grid('on')