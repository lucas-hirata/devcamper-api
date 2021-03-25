export default class BootcampsController {
    // @desc    List all bootcamps
    // @route   GET /api/v1/bootcamps
    // @access  Public
    async list(req, res) {
        return res.status(200).json({ sucess: true, msg: 'List bootcamps' });
    }

    // @desc    Get single bootcamp
    // @route   GET /api/v1/bootcamps/:id
    // @access  Public
    async get(req, res) {
        return res.status(200).json({ sucess: true, msg: 'Get bootcamp' });
    }

    // @desc    Create new bootcamp
    // @route   POST /api/v1/bootcamps
    // @access  Private
    async create(req, res) {
        return res.status(200).json({ sucess: true, msg: 'Create bootcamp' });
    }

    // @desc    Update bootcamp
    // @route   PUT /api/v1/bootcamps/:id
    // @access  Private
    async update(req, res) {
        return res.status(200).json({ sucess: true, msg: 'Update bootcamp' });
    }

    // @desc    Delete bootcamp
    // @route   DELETE /api/v1/bootcamps/:id
    // @access  Private
    async delete(req, res) {
        return res.status(200).json({ sucess: true, msg: 'Delete bootcamp' });
    }
}
