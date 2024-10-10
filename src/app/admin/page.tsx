"use client";

import { RefreshCw } from "lucide-react";
import { Badge } from "@/src/components/chat/ui/badge";
import { Button } from "@/src/components/chat/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/chat/ui/card";
import { ScrollArea } from "@/src/components/chat/ui/scroll-area";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import socket from "@/src/lib/getSocket";

interface Report {
  reporterId: string;
  reporterName: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export default function AdminPage() {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [reports, setReports] = useState<Report[]>([]);
  
  const getReports = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/admin/getReports`,
        {
          method: "GET",
        }
      );
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      const parsedData = data.map((report: string) => JSON.parse(report));
      setReports(parsedData);
    } catch (error) {
      toast.error("Failed to fetch new reports!");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await getReports();
      setIsRefreshing(false);
    } catch (error) {
      toast.error("Failed to fetch new reports!");
    }
  };

  const handleReport = async (isDelete: boolean, report: Report) => {
    try {
        const res = await fetch(`/api/admin/handleReportedMessage`, {
          method: "post",
          body: JSON.stringify({
            report: report,
            isDelete: isDelete
          }),
        });
        const resMessage = await res.json();
        if (!res.ok) {
          toast.error(resMessage.error);
        } else {
          setReports((prevItems) => prevItems.filter(item => item !== report));  
          if (isDelete){
            socket.emit("newMessage", { idToAdd: report.reporterId });
            socket.emit("newMessage", { idToAdd: report.senderId });
          }
          toast.success("Message has been dealed with!")
        }
      } catch (error) {
        toast.error("There was an error! Try again");
      }
  };

  useEffect(() => {
    getReports();
  }, []);

  return (
    <Card className="bg-white ">
      <CardHeader className="space-y-1 sm:space-y-0 sm:flex sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-purple-200 ">
        <div>
          <CardTitle className="text-lg sm:text-xl text-purple-800 ">
            Reported Messages
          </CardTitle>
          <CardDescription className="text-sm text-purple-600 ">
            Review and take action on reported messages.
          </CardDescription>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full sm:w-auto mt-2 sm:mt-0 bg-purple-600 hover:bg-purple-700 text-white"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {reports.map((report, index) => (
            <div
              key={index}
              className="mb-4 p-3 sm:p-4 border border-purple-200 rounded bg-purple-50 "
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-purple-800 ">
                    {report.senderName}
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-600 ">
                    Reported by: {report.reporterName}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="mt-1 sm:mt-0 text-xs sm:text-sm bg-purple-200 text-purple-800 "
                >
                  Reported at: {report.timestamp}
                </Badge>
              </div>
              <p className="mb-2 text-sm sm:text-base text-purple-900 ">
                {report.content}
              </p>
              <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleReport(true, report)}
                >
                  Delete this message
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto border-purple-300 text-purple-700 hover:bg-purple-100"
                  onClick={() => handleReport(false, report)}
                >
                  Ignore Report
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
