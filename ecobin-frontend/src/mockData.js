export const mockUser = {
  name: "Jane Doe",
  zone: "Zone 4 - Downtown",
  avatar: "JD"
};

export const citizenNotifications = [
  { id: 1, read: false, message: "Your pickup request was completed." },
  { id: 2, read: false, message: "Reminder: Recycling center closed tomorrow." },
  { id: 3, read: true, message: "Welcome to EcoBin!" }
];

export const collectorNotifications = [
  { id: 1, read: false, message: "New priority bin assigned." },
  { id: 2, read: false, message: "Route update available." },
  { id: 3, read: false, message: "Vehicle maintenance scheduled." }
];

export const adminNotifications = [
  { id: 1, read: false, message: "New user registration." },
  { id: 2, read: true, message: "System backup completed." }
];
