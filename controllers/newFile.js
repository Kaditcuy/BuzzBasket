/* Simple route to check server status */
exports.testRoute = (req, res) => {
  console.log('Reached /api/status route handler');
  res.json({ message: 'Server is up and running' });
};
