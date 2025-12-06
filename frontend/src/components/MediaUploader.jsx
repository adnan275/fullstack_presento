import React, { useState } from 'react';
import './MediaUploader.css';

export default function MediaUploader({ photos, setPhotos, video, setVideo, uploading }) {
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const [videoPreview, setVideoPreview] = useState(null);
    const [errors, setErrors] = useState([]);

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        const currentPhotoCount = photos.length;

        if (currentPhotoCount + files.length > 5) {
            setErrors([...errors, 'You can upload a maximum of 5 photos']);
            return;
        }

        const validFiles = [];
        const newPreviews = [];
        const newErrors = [];

        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                newErrors.push(`${file.name} is too large. Maximum size is 5MB`);
                return;
            }

            if (!file.type.startsWith('image/')) {
                newErrors.push(`${file.name} is not an image file`);
                return;
            }

            validFiles.push(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result);
                if (newPreviews.length === validFiles.length) {
                    setPhotoPreviews([...photoPreviews, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });

        if (newErrors.length > 0) {
            setErrors([...errors, ...newErrors]);
        }

        setPhotos([...photos, ...validFiles]);
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const newErrors = [];

        if (file.size > 20 * 1024 * 1024) {
            newErrors.push('Video file is too large. Maximum size is 20MB');
            setErrors([...errors, ...newErrors]);
            return;
        }

        if (!file.type.startsWith('video/')) {
            newErrors.push('Selected file is not a video');
            setErrors([...errors, ...newErrors]);
            return;
        }

        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';
        videoElement.onloadedmetadata = () => {
            window.URL.revokeObjectURL(videoElement.src);
            if (videoElement.duration > 20) {
                setErrors([...errors, 'Video duration must be 20 seconds or less']);
                return;
            }
        };
        videoElement.src = URL.createObjectURL(file);

        setVideo(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setVideoPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removePhoto = (index) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        const newPreviews = photoPreviews.filter((_, i) => i !== index);
        setPhotos(newPhotos);
        setPhotoPreviews(newPreviews);
    };

    const removeVideo = () => {
        setVideo(null);
        setVideoPreview(null);
    };

    const clearError = (index) => {
        setErrors(errors.filter((_, i) => i !== index));
    };

    return (
        <div className="media-uploader">
            <div className="media-uploader-section">
                <label className="media-uploader-label">
                    Photos (Optional - Max 5)
                </label>

                <div className="photo-upload-area">
                    {photoPreviews.length > 0 && (
                        <div className="photo-previews">
                            {photoPreviews.map((preview, index) => (
                                <div key={index} className="photo-preview-item">
                                    <img src={preview} alt={`Preview ${index + 1}`} />
                                    <button
                                        type="button"
                                        className="remove-photo-btn"
                                        onClick={() => removePhoto(index)}
                                        disabled={uploading}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {photos.length < 5 && (
                        <label className="upload-btn photo-upload-btn">
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                multiple
                                onChange={handlePhotoChange}
                                disabled={uploading}
                                style={{ display: 'none' }}
                            />
                            <span className="upload-icon">📸</span>
                            <span>Add Photos</span>
                        </label>
                    )}
                </div>
            </div>

            <div className="media-uploader-section">
                <label className="media-uploader-label">
                    Video (Optional - Max 20 seconds)
                </label>

                <div className="video-upload-area">
                    {videoPreview ? (
                        <div className="video-preview-item">
                            <video src={videoPreview} controls />
                            <button
                                type="button"
                                className="remove-video-btn"
                                onClick={removeVideo}
                                disabled={uploading}
                            >
                                Remove Video
                            </button>
                        </div>
                    ) : (
                        <label className="upload-btn video-upload-btn">
                            <input
                                type="file"
                                accept="video/mp4,video/mov,video/avi"
                                onChange={handleVideoChange}
                                disabled={uploading}
                                style={{ display: 'none' }}
                            />
                            <span className="upload-icon">🎥</span>
                            <span>Add Video</span>
                        </label>
                    )}
                </div>
            </div>

            {errors.length > 0 && (
                <div className="media-upload-errors">
                    {errors.map((error, index) => (
                        <div key={index} className="media-upload-error">
                            <span>{error}</span>
                            <button onClick={() => clearError(index)}>×</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
