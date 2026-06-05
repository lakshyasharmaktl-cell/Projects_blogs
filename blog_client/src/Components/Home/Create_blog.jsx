import React, { useState } from 'react'
import axios from 'axios'
import {
  FaImage,
  FaPenNib,
  FaTags,
  FaFolderOpen,
} from 'react-icons/fa'

export default function Create_blog() {

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: "",
    body: "",
    thumbnail: "",
    authorId: "", // Add this - you need to get this from your auth system or props
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous message
    setMessage({ type: '', text: '' })
    
    // Basic validation
    if (!formData.title || !formData.body || !formData.authorId || !formData.category) {
      setMessage({ type: 'error', text: 'Please fill all required fields (title, body, authorId, category)' })
      return
    }
    
    setLoading(true)
    
    try {
      const response = await axios.post('http://localhost:7890/create_blogs', formData)
      
      console.log('Success:', response.data)
      
      // Show success message
      setMessage({ type: 'success', text: 'Blog published successfully!' })
      
      // Reset form
      setFormData({
        title: "",
        category: "",
        tags: "",
        body: "",
        thumbnail: "",
        authorId: formData.authorId, // Keep the authorId
      })
      
      
    } catch (error) {
      console.error('Error:', error)
      

      if (error.response) {
       
        const errorMsg = error.response.data.msg || 'Failed to create blog'
        setMessage({ type: 'error', text: errorMsg })
        
        if (error.response.status === 400) {
          setMessage({ type: 'error', text: 'Missing required fields' })
        } else if (error.response.status === 404) {
          setMessage({ type: 'error', text: 'Author not found' })
        } else if (error.response.status === 500) {
          setMessage({ type: 'error', text: 'Server error. Please try again later.' })
        }
      } else if (error.request) {
        // Request was made but no response
        setMessage({ type: 'error', text: 'Cannot connect to server. Please check if backend is running.' })
      } else {
        // Something else happened
        setMessage({ type: 'error', text: error.message || 'An error occurred' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-black flex items-center gap-3">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-2xl text-white">
              <FaPenNib />
            </span>
            Create Blog
          </h1>
          <p className="text-gray-500 mt-3">
            Write and publish your amazing blog content.
          </p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Author ID - Hidden or you can show it if needed */}
          <div>
            <label className="text-black font-semibold mb-2 block">
              Author ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="authorId"
              value={formData.authorId}
              onChange={handleChange}
              placeholder="Enter author ID"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              You'll get this from your authentication system
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="text-black font-semibold mb-2 block">
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title..."
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-black font-semibold mb-2 flex items-center gap-2">
              <FaFolderOpen className="text-blue-600" />
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Technology, Coding..."
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-purple-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-black font-semibold mb-2 flex items-center gap-2">
              <FaTags className="text-purple-600" />
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="react, node, javascript"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-blue-500"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="text-black font-semibold mb-2 flex items-center gap-2">
              <FaImage className="text-blue-600" />
              Thumbnail URL
            </label>
            <input
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="Paste image url..."
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-purple-500"
            />
          </div>

          {/* Body */}
          <div>
            <label className="text-black font-semibold mb-2 block">
              Blog Content <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="10"
              name="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="Write your blog here..."
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none resize-none focus:border-blue-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </span>
            ) : (
              'Publish Blog'
            )}
          </button>

        </form>
      </div>
    </div>
  )
}