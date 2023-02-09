// Daniel Semerjian - 318004504
// Shay Solomon - 209088442
// Elinor Cohen - 322624453

const mongoose = require('mongoose');
const crypto = require('crypto');

//connect to the mongodb atlas
mongoose.connect(
    'mongodb+srv://eli:ec.123456@cluster0.tqy14c2.mongodb.net/server_side_project?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

//create the required collections
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: { type: Number, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    birthday: { type: String, required: true }
});

const costSchema = new Schema({
    user_id: { type: Number, required: true },
    year: { type: Number, required: false },
    month: { type: Number, required: false },
    day: { type: Number, required: false },
    id: {type: String, index: true, required: true, unique: true, default: crypto.createHash('sha256').update(Math.random().toString() + Date.now().toString()).digest('hex')},
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ['food', 'health', 'housing', 'sport', 'education', 'transportation', 'other'] },
    sum: { type: Number, required: true }
});

const reportSchema = new Schema({
    user_id: { type: Number, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    report: { type: JSON, required: true, default: {'food':[], 'health':[], 'housing':[], 'sport':[], 'education':[], 'transportation':[], 'other':[]}}
});

// create the models for the schemas
const User = mongoose.model('User', userSchema);
const Cost = mongoose.model('Cost', costSchema);
const Report = mongoose.model('Report', reportSchema);

//function that checks if the user exists
const UserExists = async (userId) => {
    return new Promise((resolve, reject) => {
        User.findOne({id: userId}, function (error, user) {
            if (error) {
                console.error(error);
            } else if (user) {
                console.log("User was found");
                resolve(true);
            } else {
                console.log("User was not found");
                resolve(false);
            }
        })
    });
}

//functions that validates the date parameters
const DayIsValid = (day) => {
    if (day > 0 && day <= 31) {
        return true;
    }
    return false;
}

const MonthIsValid = (month) => {
    if (month > 0 && month <= 12) {
        return true;
    }
    return false;
}

const YearIsValid = (year) => {
    let curr_year = new Date().getFullYear();
    if (year >= 1970 && year <= curr_year) {
        return true;
    }
    return false;
}

//function that adds a new cost to the costs collection
const AddCost = async (user_id, year, month, day, description, category, sum) => {
    return new Promise(async (resolve, reject) => {
        //check if the user exists
        let userExists = await UserExists(user_id);
        if (!userExists) {
            return reject('User not exists');
        }

        //validate the date parameters
        let updated_year = year || new Date().getFullYear();
        let updated_month = month || new Date().getMonth();
        let updated_day = day || new Date().getDay();

        let DayValid = await DayIsValid(updated_day);
        let MonthValid = await MonthIsValid(updated_month);
        let YearValid = await YearIsValid(updated_year);
        if (!DayValid || !MonthValid || !YearValid) {
            return reject('one or more parameters are invalid');
        }

        //create the new cost and save it in the costs collection
        const cost = new Cost({
            user_id: user_id,
            year: updated_year,
            month: updated_month,
            day: updated_day,
            description: description,
            category: category,
            sum: sum
        });

        await cost.save(function (error) {
            if (error) {
                console.error(error);
            } else {
                console.log("Cost was saved successfully");
            }
        });

        //check if there is an existing report for the matching user_id, month and year and update it
        const existingReport = await Report.findOne({ user_id: user_id, year: updated_year, month: updated_month});
        if (existingReport) {
            await existingReport.report[`${category}`].push({
                day: updated_day,
                description: description,
                sum: sum
            });
            await Report.updateOne({ user_id: user_id, year: updated_year, month: updated_month},{report: existingReport.report});
        }
        resolve(cost);
    })
}

//function that creates a new report
const CreateReport = async (user_id, month, year) => {
    return new Promise(async (resolve, reject) => {
        //check if the user exists
        let userExists = await UserExists(user_id);
        if (!userExists) {
            return reject('User not exists');
        }

        //check if the requested report already exists and returning it
        let existingReport = await Report.findOne({ user_id: user_id, year: year, month: month});
        if (existingReport) {
            resolve(existingReport.report);
            return;
        }

        //check if there are costs for the requested user_id, month and year so that we can create a new report
        let costs = await Cost.find({ user_id: user_id, year: year, month: month});
        if (costs.length === 0) {
            return reject('Empty report - not created');
        }

        //create the new report for each cost that matches the requested user_id, month and year
        const newReport = await new Report({user_id: user_id, year: year, month: month})
        await costs.forEach(cost => {
            newReport.report[cost.category].push({
                day: cost.day,
                description: cost.description,
                sum: cost.sum
            });
        });

        //save the report we just created so we can update it and return it if requested - instead of creating a new report on each request
        await newReport.save(function (error) {
            if (error) {
                console.error(error);
            } else {
                console.log("Report was saved successfully");
            }
        });
        resolve(newReport.report);
    });
}

//function that creates user if not exist - not exported
const CreateUser = async (id, first_name, last_name, birthday) => {
    let userExists = await UserExists(id);
    if(userExists) {
        console.log("User already exists");
        return;
    }
    const user = new User({
        id: id,
        first_name: first_name,
        last_name: last_name,
        birthday: birthday
    });

    await user.save(function (error) {
        if (error) {
            console.error(error);
        } else {
            console.log("User was saved successfully");
        }
    });
}


//create the required user and save it in the users collection
CreateUser(123123, 'Moshe', 'Israeli', 'January, 10th, 1990');

//export the needed functions for the routes
module.exports = {AddCost, CreateReport};