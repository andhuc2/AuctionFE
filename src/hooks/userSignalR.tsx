import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { API_URL } from "../utils/URLMapping";

const useSignalR = (hubUrl: string) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  useEffect(() => {
    hubUrl = API_URL + hubUrl;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        withCredentials: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, [hubUrl]);

  return connection;
};

export default useSignalR;
