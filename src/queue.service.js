const Memory = require('memory-sri');

const plus = function (a, b) {
  return a + b;
};

// register processor
Memory.process('test', async function (data, meta) {
  console.log("Running queued task with:");
  console.log(data);
  console.log(meta);
  // do your background work
  let a = data.price;
  let b = data.value;
  let c = plus(a, b);
  console.log(`total: ${c}`);
});
