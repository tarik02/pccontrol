import z from 'zod';

export const ModeSchema = z.discriminatedUnion('name', [
    z.object({ name: z.literal('silent') }),
    z.object({ name: z.literal('idle') }),
    z.object({ name: z.literal('semi') }),
    z.object({ name: z.literal('semi2') }),
    z.object({ name: z.literal('perf') })
]);

export const RgbModeSchema = z.discriminatedUnion('name', [
    z.object({
        name: z.literal('off')
    }),
    z.object({
        name: z.literal('default')
    }),
    z.object({
        name: z.literal('static'),
        params: z.object({
            color: z.object({
                r: z.number().int().min(0).max(255),
                g: z.number().int().min(0).max(255),
                b: z.number().int().min(0).max(255)
            })
        })
    }),
    z.object({
        name: z.literal('colorcycle'),
        params: z.object({
            speed: z.number()
        })
    })
]);

export const StatsSchema = z.object({
    temps: z.object({
        cpu: z.number(),
        gpu: z.number()
    })
});

export const StatusSchema = z.object({
    mode: ModeSchema,
    rgb_mode: RgbModeSchema,
    stats: StatsSchema
});
