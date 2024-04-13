require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the Hall Booking Application');
});

// Define the rooms and bookings arrays
let rooms = [];
let bookings = [];

// Create a room
app.post('/api/rooms', (req, res) => {
    const { name, seats, amenities, pricePerHour } = req.body;
    const newRoom = {
        id: Math.floor(Math.random() * 100), // Generate random ID
        name,
        seats,
        amenities,
        pricePerHour,
    };
    rooms.push(newRoom);
    res.status(201).json(newRoom);
});

// Book a room
app.post('/api/bookings', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;
    const room = rooms.find(room => room.id === roomId);
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }
    const booking = {
        id: Math.floor(Math.random() * 100), // Generate random ID
        customerName,
        date,
        startTime,
        endTime,
        roomId,
    };
    bookings.push(booking);
    res.status(201).json(booking);
});

// List all Rooms with Booked Data
app.get('/api/rooms/bookings', (req, res) => {
    const result = rooms.map(room => {
        const roomBookings = bookings.filter(booking => booking.roomId === room.id);
        const bookedStatus = roomBookings.length > 0 ? 'Booked' : 'Available';
        return {
            roomName: room.name,
            bookedStatus,
            bookings: roomBookings.map(booking => ({
                customerName: booking.customerName,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime
            }))
        };
    });
    res.status(200).json(result);
});

// List all customers with booked Data
app.get('/api/customers/bookings', (req, res) => {
    const result = [];
    bookings.forEach(booking => {
        const room = rooms.find(room => room.id === booking.roomId);
        result.push({
            customerName: booking.customerName,
            roomName: room ? room.name : 'Room Not Found',
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime
        });
    });
    res.status(200).json(result);
});


/// List how many times a customer has booked the room
app.get('/api/customer/:name/room/:roomId/bookings', (req, res) => {
    const { name, roomId } = req.params;
    const customerBookings = bookings.filter(booking => booking.customerName === name && booking.roomId === parseInt(roomId));
    const room = rooms.find(room => room.id === parseInt(roomId));
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }
    const result = {
        customerName: name,
        roomName: room.name,
        bookingCount: customerBookings.length,
        bookings: customerBookings
    };
    res.status(200).json(result);
});


// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
