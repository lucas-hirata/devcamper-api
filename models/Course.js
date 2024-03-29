import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    weeks: {
        type: String,
        required: [true, 'Weeks is required'],
    },
    tuition: {
        type: Number,
        required: [true, 'Tuition cost is required'],
    },
    minimumSkill: {
        type: String,
        required: [true, 'Minimum Skill is required'],
        enum: ['beginner', 'intermediate', 'advanced'],
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
});

CourseSchema.statics.getAverageCost = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId },
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' },
            },
        },
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
        });
    } catch (error) {
        console.log(error);
    }
};

CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp);
});

CourseSchema.pre('remove', function () {
    this.constructor.getAverageCost(this.bootcamp);
});

export default mongoose.model('Course', CourseSchema);
