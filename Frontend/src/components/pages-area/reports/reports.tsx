import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { VacationReportModel } from "../../../models/vacation-report-model";
import { dataService } from "../../../services/data-service";
import { notify } from "../../../utils/notify";
import "./reports.css";

export function Reports() {

    // Report data:
    const [report, setReport] =
        useState<VacationReportModel[]>([]);

    // Load report when component starts:
    useEffect(() => {
        loadReport();
    }, []);

    // Get report from Backend:
    async function loadReport() {
        try {
            const data =
                await dataService.getVacationsReport();

            setReport(data);
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    // Download report as CSV:
    function downloadCsv(): void {

        const header =
            "Destination,Likes\n";

        const rows = report
            .map(item =>
                `"${item.destination}",${item.likesCount}`
            )
            .join("\n");

        const csv =
            header + rows;

        const blob =
            new Blob(
                [csv],
                { type: "text/csv;charset=utf-8;" }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download =
            "vacations-likes-report.csv";

        link.click();

        URL.revokeObjectURL(url);
    }

    return (
        <div className="Reports">

            <h2>Vacation Reports</h2>

            <button onClick={downloadCsv}>
                Download CSV
            </button>

            <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                    <BarChart data={report}>

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="destination"
                        />

                        <YAxis
                            allowDecimals={false}
                        />

                        <Tooltip />

                        <Bar
                            dataKey="likesCount"
                            name="Likes"
                        />

                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}