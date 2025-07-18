"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Download, Share2 } from "lucide-react"

export default function EventImageGenerator() {
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("")
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  /*  ───────────────── upload preview ───────────────── */
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProfileFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  /*  ───────────────── generate server-side image ───────────────── */
  const generate = async () => {
    if (!fullName || !role || !profileFile) return
    setPending(true)

    try {
      const fd = new FormData()
      fd.append("fullName", fullName)
      fd.append("role", role)
      fd.append("profileImage", profileFile)

      const res = await fetch("/api/generate-image", { method: "POST", body: fd })
      if (!res.ok) throw new Error(await res.text())

      const blob = await res.blob()
      setGeneratedUrl(URL.createObjectURL(blob))
    } catch (err) {
      console.error("Image generation failed:", err)
      alert("Something went wrong while generating the image.")
    } finally {
      setPending(false)
    }
  }

  /*  ───────────────── helpers ───────────────── */
  const download = () => {
    if (!generatedUrl) return
    const a = document.createElement("a")
    a.href = generatedUrl
    a.download = `${fullName.replace(/\s+/g, "-")}-blockchain-week.png`
    a.click()
  }

  const share = async () => {
    if (!generatedUrl) return
    try {
      const blob = await (await fetch(generatedUrl)).blob()
      const file = new File([blob], "blockchain-week.png", { type: "image/png" })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Blockchain Week",
          text: "I will be attending Blockchain Week 2025!",
          files: [file],
        })
      } else {
        await navigator.clipboard.writeText(generatedUrl)
        alert("Link copied to clipboard!")
      }
    } catch (e) {
      console.error("share error", e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Ethiopia Blockchain Week 2025</h1>
          <p className="text-xl text-gray-600">Generate your volunteer/attendee card</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* ─────────── FORM ─────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Step 1 – Your details</CardTitle>
              <CardDescription>Fill in your name and upload a profile photo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ada Lovelace"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Event Organizer" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Profile Image</Label>

                <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleFile} />
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  type="button"
                  onClick={() => document.getElementById("image")?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" /> Choose Image
                </Button>

                {previewUrl && (
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="preview"
                    className="w-24 h-24 rounded-full object-cover mx-auto mt-4 border-4 border-white shadow-lg"
                  />
                )}
              </div>

              <Button className="w-full" onClick={generate} disabled={!fullName || !role || !profileFile || pending}>
                {pending ? "Generating…" : "Generate Graphic"}
              </Button>
            </CardContent>
          </Card>

          {/* ─────────── RESULT ─────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Step 2 – Download / Share</CardTitle>
              <CardDescription>Your personalised social image appears here</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedUrl ? (
                <div className="space-y-4">
                  <img
                    src={generatedUrl || "/placeholder.svg"}
                    alt="Generated attendance card"
                    className="w-full rounded-lg shadow-lg border"
                  />

                  <div className="flex gap-2">
                    <Button onClick={download} className="flex-1">
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                    <Button onClick={share} variant="outline" className="flex-1 bg-transparent">
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-lg text-gray-500">
                  Generate the image to preview it here
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
