const Sequelize = require('sequelize');
sequelize = new Sequelize("postgres://nzmgklgxvfzrkk:c15a9bc2c4a618b0c8011a4e320f4b8924880f97d6041a0c98d95996870eba51@ec2-34-224-226-38.compute-1.amazonaws.com:5432/d46ssmmc81sv6f", {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);


module.exports = sequelize;
