import React, { useState } from "react";
import { useGroups } from "./GroupsContext";
import "./CreateGroupPage.css";

interface CreateGroupPageProps {
  onGroupCreated?: () => void;
  onCancel?: () => void;
}

const CreateGroupPage: React.FC<CreateGroupPageProps> = ({
  onGroupCreated,
  onCancel,
}) => {
  const { addGroup } = useGroups();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxMembers: 12,
    entryFee: 25,
    isPrivate: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add the group using the context
      addGroup({
        name: formData.name,
        description: formData.description,
        members: [], // Will be populated by addGroup function
        maxMembers: formData.maxMembers,
        entryFee: formData.entryFee,
        isPrivate: formData.isPrivate,
        owner: "current_user", // In a real app, this would be the logged-in user
      });

      alert("Group created successfully!");
      setFormData({
        name: "",
        description: "",
        maxMembers: 12,
        entryFee: 25,
        isPrivate: false,
      });

      if (onGroupCreated) onGroupCreated();
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the group.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div className="create-group-container">
      <h1 className="create-group-title">Create a New Group</h1>

      <div className="create-group-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Group Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            disabled={isSubmitting}
            placeholder="Enter group name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-textarea"
            disabled={isSubmitting}
            placeholder="Describe your group"
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxMembers" className="form-label">
            Maximum Members
          </label>
          <input
            type="number"
            id="maxMembers"
            name="maxMembers"
            value={formData.maxMembers}
            onChange={handleInputChange}
            className="form-input"
            disabled={isSubmitting}
            min={2}
            max={50}
          />
        </div>

        <div className="form-group">
          <label htmlFor="entryFee" className="form-label">
            Entry Fee ($)
          </label>
          <input
            type="number"
            id="entryFee"
            name="entryFee"
            value={formData.entryFee}
            onChange={handleInputChange}
            className="form-input"
            disabled={isSubmitting}
            min={0}
          />
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="isPrivate"
            name="isPrivate"
            checked={formData.isPrivate}
            onChange={handleInputChange}
            className="checkbox-input"
            disabled={isSubmitting}
          />
          <label htmlFor="isPrivate" className="checkbox-label">
            Private Group (invite only)
          </label>
        </div>

        <div className="form-buttons">
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={
              isSubmitting ||
              !formData.name.trim() ||
              !formData.description.trim()
            }
          >
            {isSubmitting ? "Creating..." : "Create Group"}
          </button>
          <button
            onClick={handleCancel}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage;
