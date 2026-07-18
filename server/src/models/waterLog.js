import mongoose from 'mongoose';
const schema = new mongoose.Schema({ demoUsername: { type: String, required: true }, date: { type: String, required: true }, entries: { type: [Number], default: [] } }, { timestamps: true, versionKey: false });
schema.index({ demoUsername: 1, date: 1 }, { unique: true });
export default mongoose.model('WaterLog', schema);
