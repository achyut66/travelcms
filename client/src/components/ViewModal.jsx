import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const ViewModal = ({ visible, onClose, title, data, displayColumns }) => {
  if (!data) return null;

  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-40" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="translate-y-full opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="transition ease-in duration-200"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-full opacity-0"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-bold text-center mb-4">
                  {title}
                </Dialog.Title>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  {Object.entries(data).map(([key, value]) => {
                    // Check if the key is part of the displayColumns array
                    if (displayColumns.includes(key)) {
                      return (
                        <div key={key}>
                          <span className="font-medium capitalize block">
                            {key.replace(/_/g, " ")}:
                          </span>
                          {key === "logo" || key === "company_logo" ? (
                            <img
                              src={`http://localhost:5000/uploads/${value}`}
                              alt="Logo"
                              className="mt-1 rounded shadow w-24 h-24 object-cover border"
                            />
                          ) : (
                            <span className="mt-1 block text-gray-900">
                              {value || "N/A"}
                            </span>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    className="bg-blue-600 px-4 py-2 text-white rounded"
                    onClick={onClose}
                  >
                    Close
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

export default ViewModal;
