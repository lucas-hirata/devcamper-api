const advancedResults = (model, populate) => async (req, res, next) => {
    let requestQuery = { ...req.query };

    const paramsToRemove = ['select', 'sort', 'page', 'limit'];

    paramsToRemove.forEach((param) => delete requestQuery[param]);

    let queryString = JSON.stringify(requestQuery);
    queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    // Finding resources
    let query = model.find(JSON.parse(queryString));

    // Selecting
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    // Query execution
    const results = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        pagination.previous = {
            page: page - 1,
            limit,
        };
    }

    res.advancedResults = {
        sucess: true,
        count: results.length,
        pagination,
        data: results,
    };

    next();
};

export default advancedResults;
