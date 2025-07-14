import { ImageResponse } from "next/og"

// import { Card } from "@/components/ui/card"
import type { NextRequest } from "next/server"
import { headers } from 'next/headers'; 
import { Buffer } from "buffer"
import sidebarImage from '../../../public/images/sidebar.png';
/**
 * POST /api/generate-image
 *
 * Accepts multipart/form-data:
 *  - fullName      – string
 *  - profileImage  – file
 */
export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()

    const fullName = (fd.get("fullName") ?? "") as string
    const role = (fd.get("role") ?? "") as string
    const file = fd.get("profileImage") as File | null

    /* turn the uploaded file into a small data-uri */
    const dataUri = file
      ? await (async () => {
          const buf = Buffer.from(await file.arrayBuffer())
          return `data:${file.type || "image/png"};base64,${buf.toString("base64")}`
        })()
      : "/placeholder.svg"

    return new ImageResponse(<VolunteerCard fullName={fullName} role={role} avatar={dataUri}/>, {  width: 1200,
      height: 675, })
  } catch (e) {
    console.log("[OG]", e)
    return new Response("Failed to generate image", { status: 500 })
  }
}

/**
 * The actual Satori / OG template
 */
function VolunteerCard({ fullName, role, avatar }: { fullName: string; role: string; avatar: string }) {
  const headersList = headers();
  const host = headersList.get('host');
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)",
        position: "relative",
        fontFamily: "Inter, sans-serif",
        padding: "40px",
      }}
    >
      {/* Sponsor Logos Row */}
    

      {/* Main Content Container */}
      <div
        style={{
          display: "flex",
        }}
      >
        {/* Left Side Content */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
              src={`http://${host}/images/sidebar.png`}
              alt="profile"
              width={"750px"}
              height={"620px"}
            />
        </div>

        {/* Right Side - Profile */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            alignItems: "center",
            // paddingLeft: 60,
          }}
        >
          {/* Profile Image */}
          <div
            style={{
              width: 280,
              height: 280,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              border: "8px solid #1e40af",
              backgroundColor: "#1e40af",
              marginBottom: 40,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar || "/placeholder.svg"}
              alt="profile"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Name and Role */}
          <div style={{ textAlign: "center", display:"flex", flexDirection:"column" }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "white",
                display:"flex",
                marginBottom: 15,
              }}
            >
              NAME: {fullName.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                display: "flex",
                color: "white",
              }}
            >
              ROLE: {role.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
  )
}

