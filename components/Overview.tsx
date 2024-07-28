"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card } from "./ui/card";

interface OverviewProps {
    data: any;
}

const chartConfig = {
    total: {
        label: "Total",
        theme: {
            light: "rgb(10, 10, 10)",
            dark: "rgb(256, 256, 256)",
        },
    },
} satisfies ChartConfig;

export const Overview: React.FC<OverviewProps> = ({ data }) => {
    console.log(data)

    return (
        <Card className="border-none px-5 md:px-8 shadow-none">
            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] min-h-[200px] lg:h-[500px] w-full">
                <BarChart
                    accessibilityLayer
                    data={data}
                    margin={{
                        top: 20,
                        bottom: 10,
                    }}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1, 3)}
                        fontSize={12}
                        stroke="#888888"
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value}`}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" className="text-sm" />}
                    />
                    <Bar
                        dataKey="total"
                        fill="var(--color-total)"
                        radius={4}
                    >
                        <LabelList
                            dataKey="total"
                            position="top"
                            offset={8}
                            className="fill-foreground"
                            fontSize={12}
                            formatter={(value: number) => `₹${value}`}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </Card>
    );
};