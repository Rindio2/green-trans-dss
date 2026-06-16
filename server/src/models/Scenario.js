import mongoose from 'mongoose';

const legSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    mode: {
      type: String,
      enum: ['direct_truck', 'truck_first', 'barge', 'truck_last'],
      required: true
    },
    distanceKm: { type: Number, default: 0 },
    transportCost: { type: Number, default: 0 },
    handlingCost: { type: Number, default: 0 },
    waitingCost: { type: Number, default: 0 },
    otherCost: { type: Number, default: 0 },
    travelTimeHours: { type: Number, default: 0 },
    handlingTimeHours: { type: Number, default: 0 },
    waitingTimeHours: { type: Number, default: 0 },
    bufferTimeHours: { type: Number, default: 0 },
    emissionFactor: { type: Number, default: 0 }
  },
  { _id: false }
);

const optionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['road', 'waterway'],
      required: true
    },
    consolidationScore: { type: Number, default: 3, min: 1, max: 5 },
    flexibilityScore: { type: Number, default: 3, min: 1, max: 5 },
    infrastructureScore: { type: Number, default: 3, min: 1, max: 5 },
    legs: [legSchema],
    totals: {
      cost: { type: Number, default: 0 },
      time: { type: Number, default: 0 },
      emission: { type: Number, default: 0 }
    },
    normalized: {
      cost: { type: Number, default: 0 },
      time: { type: Number, default: 0 },
      emission: { type: Number, default: 0 },
      consolidation: { type: Number, default: 0 },
      flexibility: { type: Number, default: 0 },
      infrastructure: { type: Number, default: 0 }
    },
    totalScore: { type: Number, default: 0 },
    feasibleByTime: { type: Boolean, default: true }
  },
  { _id: false }
);

const weightsSchema = new mongoose.Schema(
  {
    cost: { type: Number, default: 0.3 },
    time: { type: Number, default: 0.25 },
    emission: { type: Number, default: 0.25 },
    consolidation: { type: Number, default: 0.1 },
    flexibility: { type: Number, default: 0.05 },
    infrastructure: { type: Number, default: 0.05 }
  },
  { _id: false }
);

const scenarioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: { type: String, required: true, trim: true },
    origin: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    exportPort: { type: String, default: 'Cát Lái', trim: true },
    commodity: { type: String, default: '', trim: true },
    containerQuantity: { type: Number, default: 1 },
    teu: { type: Number, required: true, min: 1 },
    maxAllowedHours: { type: Number, default: 24 },
    weights: weightsSchema,
    options: [optionSchema],
    recommendation: {
      selectedOption: {
        type: String,
        enum: ['road', 'waterway', 'none'],
        default: 'none'
      },
      reason: { type: String, default: '' },
      warnings: [{ type: String }]
    },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Scenario', scenarioSchema);
