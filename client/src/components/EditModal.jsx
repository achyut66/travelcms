import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Select from "react-select";

const DynamicModal = ({
  visible,
  onClose,
  title,
  fields,
  onSubmit,
  defaultValues,
  bookingId,
  packageName,
  id,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (visible && defaultValues) {
      const initialData = {};
      fields.forEach((field) => {
        if (field.allowMultiple) {
          initialData[field.name] = defaultValues[field.name] || [""];
        } else {
          initialData[field.name] = field.multiple
            ? defaultValues[field.name] || []
            : defaultValues[field.name] || "";
        }
      });
      setFormData(initialData);
    }
  }, [visible, fields, defaultValues]);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (index !== null) {
        const updatedArray = [...prev[name]];
        updatedArray[index] = value;
        return { ...prev, [name]: updatedArray };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handleAddMore = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: [...(prev[name] || []), ""],
    }));
  };

  const handleRemove = (name, index) => {
    setFormData((prev) => {
      const updatedArray = [...(prev[name] || [])];
      updatedArray.splice(index, 1);
      return { ...prev, [name]: updatedArray };
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = () => {
    onSubmit(formData, bookingId, id);
    onClose();
  };

  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        <div className="fixed inset-0 bg-black opacity-30" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="transform transition duration-300"
              enterFrom="translate-x-full opacity-0"
              enterTo="translate-x-0 opacity-100"
              leave="transform transition duration-200"
              leaveFrom="translate-x-0 opacity-100"
              leaveTo="-translate-x-full opacity-0"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 text-center"
                >
                  {title}
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  {fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                      </label>

                      {field.allowMultiple ? (
                        <>
                          {(formData[field.name] || []).map((val, idx) => (
                            <div key={idx} className="flex gap-2 mt-1">
                              <input
                                type="text"
                                name={field.name}
                                value={val}
                                onChange={(e) => handleChange(e, idx)}
                                className="block w-full border border-gray-300 rounded-md p-2"
                              />
                              <button
                                type="button"
                                className="bg-red-500 text-white px-2 rounded"
                                onClick={() => handleRemove(field.name, idx)}
                              >
                                X
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
                            onClick={() => handleAddMore(field.name)}
                          >
                            + Add
                          </button>
                        </>
                      ) : field.type === "select2" ? (
                        <Select
                          isMulti={field.multiple}
                          name={field.name}
                          options={field.options}
                          value={
                            field.multiple
                              ? field.options.filter((opt) =>
                                  (formData[field.name] || []).includes(
                                    opt.value
                                  )
                                )
                              : field.options.find(
                                  (opt) => opt.value === formData[field.name]
                                ) || null
                          }
                          onChange={(selected) => {
                            const value = field.multiple
                              ? selected.map((s) => s.value)
                              : selected?.value || "";
                            setFormData((prev) => ({
                              ...prev,
                              [field.name]: value,
                            }));
                          }}
                          className="mt-1"
                        />
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={
                            field.type !== "file"
                              ? formData[field.name] || ""
                              : undefined
                          }
                          onChange={
                            field.type === "file"
                              ? handleFileChange
                              : handleChange
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    className="bg-red-500 px-4 py-2 text-white rounded"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="bg-blue-600 px-4 py-2 text-white rounded"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DynamicModal;
