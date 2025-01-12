'use client'

import { useState } from 'react'
import Link from 'next/link'
import { programs } from '../data/programs'

export default function Programs() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Các Chương trình Đào tạo của Chúng tôi</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm chương trình..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrograms.map(program => (
          <div key={program.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">{program.name}</h2>
            <p>Giảng viên: {program.instructor}</p>
            <p>Thời gian: {program.duration}</p>
            <Link href={`/programs/${program.id}`} className="text-blue-600 hover:underline">
              Xem chi tiết
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

