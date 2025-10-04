import express from 'express';

// import queue for side effects
const queue = require('./queue.service');

// import Memory for in-memory data storage
const Memory = require('memory-sri');

const app = express();
app.use(express.json());

// Example route to demonstrate Memory usage
app.get('/memory', async (req, res) => {
  try {
    // set key with TTL (seconds)
    Memory.set(1, 'a1', 20);
    Memory.set(2, { b: 2 }, 30);
    Memory.set(3, [2, 3], 40);
    Memory.set(4, [{ a: 'a1', b: 'b1' }], 50);

    // set key with no expiry
    Memory.set(5, 'not set expire');

    // get value
    console.log(Memory.get(5)); // { b: 2 }

    // check TTL
    console.log(Memory.ttl(5)); // remaining seconds

    // get all keys
    let getAll = await Memory.multiple();

    let result = [];
    for (let i = 0; i < getAll.length; i++) {
      let key = i + 1;
      let ttl = Memory.ttl(key);
      result.push({ id: getAll[i].id, data: getAll[i].data, ttl: ttl });
    }

    // delete a key
    Memory.del(1);

    // delete all keys
    Memory.delall();

    res.json({ data: result });
  } catch (error) {
    console.error('Retrieve Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Example route to demonstrate Memory usage
app.get('/run', async (req, res) => {
  try {
    // run the task processor
    let testFunction = function (a, b) {
      console.log(`result from task function: ${a + b}`);
      return a + b;
    };

    // run task with arguments
    let result = await Memory.runtask(testFunction, [2, 4]);

    res.json({ id: result.id });
  } catch (error) {
    console.error('Retrieve Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Example route to demonstrate Memory usage
app.get('/queue', async (req, res) => {
  try {
    let dataQueue = {
      user: 1,
      value: Math.random(),
      price: Math.random() * 100,
    };
    // enqueue a job
    let result = Memory.addtask('test', dataQueue, 3);

    res.json({ id: result.id, data: result.data });
  } catch (error) {
    console.error('Retrieve Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
