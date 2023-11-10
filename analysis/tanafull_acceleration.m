clear;

% loading data and giving variables
X = load("tanafull.csv");
int = 1;
c=1400;
id = X(c:int:1831, 12); % also accounts for time in  millis
acceleration = X(c:int:1831, 2);

% plotting data from the flight
figure;
plot(id, acceleration, '-k')
xlabel('id')
ylabel('acceleration')
title('acceleration against id')
legend('acceleration')
grid("on")