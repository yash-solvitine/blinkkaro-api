"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingUpdateSchema = exports.bookingCreateSchema = void 0;
const zod_1 = require("zod");
exports.bookingCreateSchema = zod_1.z.object({
    serviceId: zod_1.z.string().uuid('Invalid service ID'),
    startTime: zod_1.z.string().datetime('Invalid start time format'),
    endTime: zod_1.z.string().datetime('Invalid end time format'),
    notes: zod_1.z.string().optional(),
}).refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: 'End time must be after start time',
    path: ['endTime'],
});
exports.bookingUpdateSchema = zod_1.z.object({
    startTime: zod_1.z.string().datetime('Invalid start time format').optional(),
    endTime: zod_1.z.string().datetime('Invalid end time format').optional(),
    notes: zod_1.z.string().optional(),
}).refine((data) => {
    if (data.startTime && data.endTime) {
        return new Date(data.startTime) < new Date(data.endTime);
    }
    return true;
}, {
    message: 'End time must be after start time',
    path: ['endTime'],
});
//# sourceMappingURL=booking.schema.js.map