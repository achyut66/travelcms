import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const DynamicModal = ({
  visible,
  onClose,
  title,
  fields,
  onSubmit,
  defaultValues,
}) => {
  const [formData, setFormData] = React.useState({});

  React.useEffect(() => {
    if (visible && defaultValues) {
      const initialData = {};
      fields.forEach((field) => {
        initialData[field.name] = defaultValues[field.name] || "";
      });
      setFormData(initialData);
    }
  }, [visible, fields, defaultValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        <div className="fixed inset-0 bg-black" />

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
                      <input
                        type={field.type}
                        name={field.name}
                        value={
                          field.type !== "file"
                            ? formData[field.name]
                            : undefined
                        }
                        onChange={
                          field.type === "file"
                            ? handleFileChange
                            : handleChange
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
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
