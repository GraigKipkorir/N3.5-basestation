clear;

% loading data and giving variables
X = load("tanafull.csv");
int = 1;
c=1400;
id = X(c:int:1831, 12); % also accounts for time in  millis
velocity = X(c:int:1831, 4);

% plotting data from the flight
figure;
plot(id, velocity, '-b')
xlabel('id')
ylabel('velocity')
title('velocity against id')
legend('velocity')
grid("on")