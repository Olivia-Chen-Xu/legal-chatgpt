import SideBar from "@/components/Chat/SideBar";

export default function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
      }}
    >
      <SideBar />
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "scroll",
          justifyContent: "center",
          display: "flex",
          backgroundColor: "#F5F5F7",
        }}
      >
        {children}
      </div>
    </div>
  );
}
