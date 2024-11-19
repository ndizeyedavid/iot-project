const getTimeController = (req, res) => {
  const d = new Date();

  res.status(200).json({
    message: "Successfult returned Server Time",
    time: { hour: d.getHours(), min: d.getMinutes(), sec: d.getSeconds() },
  });
};

export default getTimeController;
