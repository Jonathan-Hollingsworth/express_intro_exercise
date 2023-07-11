const express = require('express');

const {ExpressError} = require('./errors')

function countInArray(arr, sought) {
    let count = 0;

    arr.forEach(item => {
        if(item === sought) {
            count++;
        }
    });
    return count;
}

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/mean', function(request, response, next) {
    try {
        if(!request.query.nums) {
            throw new ExpressError("No numbers found. Please provide numbers", 400)
        }
        const nums = (request.query.nums).split(',')
        if(nums.length === 1) {
            throw new ExpressError("Only one number found. Please provide multiple numbers", 400)
        }
        let total = 0
        for (const num of nums) {
            converted = Number(num)
            if (isNaN(converted)) {
                throw new ExpressError(`${num} is not a number`, 400)
            }
            total += converted
        }
        return response.json({operation: "mean", value: total/nums.length})
    } catch (error) {
        return next(error) 
    }
})

app.get('/median', function(request, response, next) {
    try {
        if(!request.query.nums) {
            throw new ExpressError("No numbers found. Please provide numbers", 400)
        }
        const nums = (request.query.nums).split(',')
        if(nums.length === 1) {
            throw new ExpressError("Only one number found. Please provide multiple numbers", 400)
        }
        const sorted = nums.sort((a,b) => a - b)
        sorted.forEach(num => {
            converted = Number(num)
            if (isNaN(converted)) {
                throw new ExpressError(`${num} is not a number`, 400)
            }
        });
        if(sorted.length%2 === 0) {
            const num1 = Number(sorted[Math.floor((sorted.length - 1) / 2)])
            const num2 = Number(sorted[Math.ceil((sorted.length) / 2)])
            return response.json({operation: "median", value: (num1+num2) / 2})
        } else {
            return response.json({operation: "median", value: Number(sorted[Math.floor((sorted.length - 1) / 2)])})
        }
    } catch (error) {
        return next(error) 
    }
})

app.get('/mode', function(request, response, next) {
    try {
        if(!request.query.nums) {
            throw new ExpressError("No numbers found. Please provide numbers", 400)
        }
        const nums = (request.query.nums).split(',')
        let most
        let countOfMost = 0
        if(nums.length === 1) {
            throw new ExpressError("Only one number found. Please provide multiple numbers", 400)
        }
        nums.forEach(num => {
            converted = Number(num)
            if (isNaN(converted)) {
                throw new ExpressError(`${num} is not a number`, 400)
            }
            const countOfNum = countInArray(nums, num)
            if(countOfNum > countOfMost){
                most = [Number(num)]
                countOfMost = countOfNum
            } else if (countOfNum === countOfMost){
                if(!most.includes(Number(num))){
                    most.push(Number(num))
                }
            }
        });
        if (countOfMost !== 1) {
            return response.json({operation: "mode", value: most})
        } else {
            return response.json({operation: "mode", value: 'All numbers are different. No mode was found'})
        }
    } catch (error) {
        return next(error) 
    }
})

app.use(function (req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError)
  });

app.use(function(err, req, res, next) {

    let status = err.status || 500;
    let message = err.message;
  
    return res.status(status).json({
      error: {message, status}
    });
});

app.listen(3000, function () {
  console.log('App on 127.0.0.1:3000');
})