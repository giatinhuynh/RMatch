"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "../services/supabaseClient";

// Define the types for the InputField props
interface InputFieldProps {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    maxLength?: number;
}

// Component for input fields
const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = "text", placeholder = "", min, max, step, maxLength }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            maxLength={maxLength}
        />
    </div>
);

// Define the types for the TextAreaField props
interface TextAreaFieldProps {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    maxLength?: number;
}

// Component for text areas
const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, value, onChange, placeholder = "", maxLength }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={4}
            maxLength={maxLength} // Restrict bio length
        />
        {maxLength && (
            <p className="text-xs text-gray-500">
                {value.length}/{maxLength} characters
            </p>
        )}
    </div>
);

// Define the types for the SelectField props
interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
}

// Component for select dropdowns
const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, options }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={onChange}>
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

// Define the types for the ImageUploadField props
interface ImageUploadFieldProps {
    label: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Image Upload Component
const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ label, onChange }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={onChange}
        />
    </div>
);

export default function Profile() {
    const [profile, setProfile] = useState({
        name: "",
        bio: "",
        profile_image: "",
        skills: "",
        desired_role: "",
        academic_program: "",
        work_preference: "",
        availability: "",
        current_courses: "",
        social_links: { linkedin: "", github: "" },
        interests: "",
        gender: "",
        gpa: "",
        age: "",
        birthday: "",
        student_id: "",
        nationality: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null); // To handle the profile image upload

    useEffect(() => {
        async function fetchProfile() {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();
            if (userError || !user) {
                setError("Error fetching user information.");
                return;
            }

            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profileError) {
                setError("Error fetching profile.");
                return;
            }

            setProfile({
                ...profileData,
                skills: profileData.skills ? profileData.skills.join(", ") : "",
                current_courses: profileData.current_courses ? profileData.current_courses.join(", ") : "",
                interests: profileData.interests ? profileData.interests.join(", ") : "",
            });
        }

        fetchProfile();
    }, []);

    const handleImageUpload = async () => {
        if (!imageFile) {
            setError("No image file selected");
            return null;
        }

        try {
            const { data, error } = await supabase.storage
                .from("profile-images")
                .upload(`public/${Date.now()}_${imageFile.name}`, imageFile);

            if (error) {
                console.error("Supabase upload error:", error.message);
                setError(`Error uploading image: ${error.message}`);
                return null;
            }

            const imageUrl = supabase.storage
                .from("profile-images")
                .getPublicUrl(data.path)
                .data.publicUrl;

            if (!imageUrl) {
                setError("Failed to retrieve image URL after upload");
                return null;
            }

            return imageUrl;
        } catch (err) {
            console.error("Unexpected error during upload:", err.message);
            setError(`Unexpected error: ${err.message}`);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (currentStep !== 3) return;

        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error("User not logged in.");
            }

            const updatedProfile = {
                ...profile,
                skills: profile.skills
                    ? profile.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
                    : [],
                current_courses: profile.current_courses
                    ? profile.current_courses.split(",").map((course) => course.trim()).filter(Boolean)
                    : [],
                interests: profile.interests
                    ? profile.interests.split(",").map((interest) => interest.trim()).filter(Boolean)
                    : [],
            };

            if (imageFile) {
                const uploadedImageUrl = await handleImageUpload();
                if (uploadedImageUrl) {
                    updatedProfile.profile_image = uploadedImageUrl;
                }
            }

            const { error: updateError } = await supabase
                .from("profiles")
                .upsert({ id: user.id, ...updatedProfile });

            if (updateError) {
                setError(updateError.message);
                return;
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message || "An error occurred while saving the profile.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep1 = () => (
        <div>
            <InputField
                label="Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your full name"
                maxLength={50}
            />
            <TextAreaField
                label="Bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell us about yourself (Max 150 characters)"
                maxLength={150}
            />
            <ImageUploadField
                label="Upload Profile Image"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)} // Handle image file
            />
            <SelectField
                label="Gender"
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                options={["Male", "Female", "Non-binary", "Other"]}
            />
            <InputField
                label="Age"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                placeholder="Enter your age"
                min={18}
                max={100}
            />
            <InputField
                label="Birthday"
                type="date"
                value={profile.birthday}
                onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
            />
            <InputField
                label="Nationality"
                value={profile.nationality}
                onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
                placeholder="Enter your nationality"
                maxLength={30}
            />
        </div>
    );

    const renderStep2 = () => (
        <div>
            <InputField
                label="Academic Program"
                value={profile.academic_program}
                onChange={(e) => setProfile({ ...profile, academic_program: e.target.value })}
                placeholder="Enter your academic program"
                maxLength={50}
            />
            <InputField
                label="Student ID"
                value={profile.student_id}
                onChange={(e) => setProfile({ ...profile, student_id: e.target.value })}
                placeholder="Enter your student ID"
                maxLength={10}
            />
            <InputField
                label="GPA"
                type="number"
                step="0.01"
                value={profile.gpa}
                onChange={(e) => setProfile({ ...profile, gpa: e.target.value })}
                placeholder="Enter your GPA (0.00 to 4.00)"
                min={0}
                max={4}
            />
            <InputField
                label="Current Courses"
                value={profile.current_courses}
                onChange={(e) => setProfile({ ...profile, current_courses: e.target.value })}
                placeholder="Enter your current courses (comma-separated)"
                maxLength={100}
            />
            <InputField
                label="Skills"
                value={profile.skills}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                placeholder="Enter your skills (comma-separated)"
                maxLength={100}
            />
            <SelectField
                label="Desired Role"
                value={profile.desired_role}
                onChange={(e) => setProfile({ ...profile, desired_role: e.target.value })}
                options={["Developer", "Designer", "Project Manager", "Researcher"]}
            />
            <SelectField
                label="Work Preference"
                value={profile.work_preference}
                onChange={(e) => setProfile({ ...profile, work_preference: e.target.value })}
                options={["Remote", "In-Person", "Hybrid"]}
            />
            <SelectField
                label="Availability"
                value={profile.availability}
                onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                options={["Weekdays", "Weekends", "Evenings", "Full-time"]}
            />
        </div>
    );

    const renderStep3 = () => (
        <div>
            <InputField
                label="Interests"
                value={profile.interests}
                onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
                placeholder="Enter your interests (comma-separated)"
                maxLength={100}
            />
            <InputField
                label="LinkedIn Profile"
                value={profile.social_links.linkedin}
                onChange={(e) =>
                    setProfile({
                        ...profile,
                        social_links: { ...profile.social_links, linkedin: e.target.value },
                    })
                }
                placeholder="Enter your LinkedIn profile URL"
            />
            <InputField
                label="GitHub Profile"
                value={profile.social_links.github}
                onChange={(e) =>
                    setProfile({
                        ...profile,
                        social_links: { ...profile.social_links, github: e.target.value },
                    })
                }
                placeholder="Enter your GitHub profile URL"
            />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 text-gray-700 bg-white">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">Profile updated successfully!</p>}

            <div className="mb-6">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
            </div>

            <div className="flex justify-between">
                {currentStep > 1 && (
                    <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={() => setCurrentStep(currentStep - 1)}>
                        Previous
                    </button>
                )}
                {currentStep < 3 ? (
                    <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md ml-auto"
                        onClick={() => setCurrentStep(currentStep + 1)}>
                        Next
                    </button>
                ) : (
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md ml-auto" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Profile"}
                    </button>
                )}
            </div>
        </form>
    );
}
