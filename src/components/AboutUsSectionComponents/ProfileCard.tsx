import React from "react"
import { Users } from "lucide-react"
const ProfileCard = ({
  name,
  location,
}: {
  name: string
  location: string
}) => {
  return (
    <div className="bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl p-8 mb-8 text-center">
      <div className="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
        <Users className="h-16 w-16 text-orange-500" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
      <p className="text-orange-100">{location}</p>
    </div>
  )
}

export default ProfileCard
