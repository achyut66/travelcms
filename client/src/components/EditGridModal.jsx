import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DynamicEditModal = ({
  visible,
  onClose,
  title,
  fields,
  onSubmit,
  defaultValues,
  defaultTravellerdata,
  h2Title,
}) => {
  // console.log(defaultTravellerdata);
  const [dataField, setDataField] = useState({});
  const [paxExtraFields, setPaxExtraFields] = useState([]);
  const extraFieldsConfig =
    fields.find((f) => Array.isArray(f.extraEditFields))?.extraEditFields || [];

  useEffect(() => {
    if (visible) {
      // Initialize booking-level fields
      const initialData = {};
      fields.forEach((field) => {
        if (field.name) {
          let value = defaultValues?.[field.name] || "";
          if (field.type === "date" && value) {
            value = new Date(value).toISOString().split("T")[0]; // YYYY-MM-DD
          }
          initialData[field.name] = value || "";
        }
      });

      // Ensure booking_id is always available (if passed as defaultValues.id)
      if (defaultValues?.id) {
        initialData.booking_id = defaultValues.id;
      }

      setDataField(initialData);

      // Initialize traveller-level fields
      if (
        defaultTravellerdata &&
        Array.isArray(defaultTravellerdata) &&
        defaultTravellerdata.length > 0
      ) {
        // Pre-fill traveller data with IDs + fields
        const filledPax = defaultTravellerdata.map((traveller) => {
          const obj = {};

          // Preserve booking_id and pax_id for backend reference
          if (traveller.booking_id) obj.booking_id = traveller.booking_id;
          if (traveller._id) obj.pax_id = traveller._id;

          // Add each extra editable field
          extraFieldsConfig.forEach(({ name }) => {
            obj[name] = traveller[name] || "";
          });

          return obj;
        });

        setPaxExtraFields(filledPax);
      } else {
        // If no traveller data exists, create empty form entries
        const paxCount = parseInt(defaultValues?.pax_no) || 0;
        const emptyPax = Array.from({ length: paxCount }, () => {
          const obj = {};
          extraFieldsConfig.forEach(({ name, defaultValue }) => {
            obj[name] = defaultValue || "";
          });
          return obj;
        });

        setPaxExtraFields(emptyPax);
      }
    }
  }, [visible, fields, defaultValues, defaultTravellerdata, extraFieldsConfig]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataField((prev) => ({ ...prev, [name]: value })); // Update dataField on change

    if (name === "pax_no") {
      const count = parseInt(value) || 0;
      setPaxExtraFields(
        Array.from({ length: count }, () => {
          const obj = {};
          extraFieldsConfig.forEach(({ name, defaultValue }) => {
            obj[name] = defaultValue || "";
          });
          return obj;
        })
      );
    }
  };

  const handleExtraChange = (index, key, value) => {
    setPaxExtraFields((prev) => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDataField((prev) => ({ ...prev, [name]: files[0] })); // Update file data in dataField
  };

  const handleSubmit = () => {
    // console.log(paxExtraFields);
    onSubmit({
      ...dataField, // Pass the entire dataField (including pax_details)
      pax_details: paxExtraFields,
    });
    onClose();
  };

  const renderExtraFields = () => {
    return paxExtraFields.map((group, idx) => (
      <div
        key={`extra-${idx}`}
        className="col-span-full grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-3 rounded"
      >
        <div className="col-span-full font-semibold text-gray-700 mb-2">
          PAX {idx + 1}
        </div>

        {extraFieldsConfig.map((field) => {
          const name = field.name; // 👈 normalized name
          const value = group[name] || "";

          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === "select2" ? (
                <Select
                  options={field.options}
                  value={field.options.find((opt) => opt.value === value)}
                  onChange={(selected) =>
                    handleExtraChange(idx, name, selected?.value || "")
                  }
                />
              ) : field.type === "file" ? (
                <input
                  type="file"
                  onChange={(e) =>
                    handleExtraChange(idx, name, e.target.files[0])
                  }
                  className="block w-full border border-gray-300 rounded-md p-2"
                />
              ) : (
                <input
                  type={field.type}
                  value={value}
                  onChange={(e) => handleExtraChange(idx, name, e.target.value)}
                  className="block w-full border border-gray-300 rounded-md p-2"
                />
              )}
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="transform transition duration-300"
              enterFrom="translate-x-full opacity-0"
              enterTo="translate-x-0 opacity-100"
              leave="transform transition duration-200"
              leaveFrom="translate-x-0 opacity-100"
              leaveTo="-translate-x-full opacity-0"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-md font-medium leading-6 text-center text-white bg-gray-700 p-3 rounded mb-4">
                  {title}
                </Dialog.Title>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {h2Title && (
                    <h2 className="col-span-full text-lg font-semibold text-center text-gray-800 mb-2 underline">
                      {h2Title}
                    </h2>
                  )}

                  {fields.map((field, index) => {
                    if (field.h2Title) {
                      return (
                        <div
                          key={`h2-${index}`}
                          className="col-span-full text-center italic p-1 bg-gray-100"
                        >
                          <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            {field.h2Title}
                          </h2>
                        </div>
                      );
                    }

                    if (!field.name) return null;

                    const inputComponent =
                      field.type === "select2" ? (
                        <Select
                          options={field.options}
                          value={field.options.find(
                            (opt) => opt.value === dataField[field.name]
                          )}
                          onChange={(selected) =>
                            setDataField((prev) => ({
                              ...prev,
                              [field.name]: selected?.value,
                            }))
                          }
                        />
                      ) : field.type === "date" ? (
                        <DatePicker
                          selected={
                            dataField[field.name]
                              ? new Date(dataField[field.name])
                              : null
                          }
                          onChange={(date) =>
                            setDataField((prev) => ({
                              ...prev,
                              [field.name]: date.toISOString().split("T")[0],
                            }))
                          }
                          dateFormat="yyyy-MM-dd"
                          className="block w-full border border-gray-300 rounded-md p-2"
                          placeholderText="Select date"
                        />
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={
                            field.type !== "file"
                              ? dataField[field.name]
                              : undefined
                          }
                          onChange={
                            field.type === "file"
                              ? handleFileChange
                              : handleChange
                          }
                          className="block w-full border border-gray-300 rounded-md p-2"
                        />
                      );

                    return (
                      <React.Fragment key={field.name}>
                        <div className="col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                            {field.isNote && (
                              <span className="text-red-500 ml-1 italic">
                                Note: Enter No. Of Pax
                              </span>
                            )}
                          </label>
                          {inputComponent}
                        </div>

                        {field.name === "pax_no" && (
                          <></> // Just leave empty here
                        )}
                      </React.Fragment>
                    );
                  })}
                  {paxExtraFields.length > 0 && (
                    <div className="col-span-full mt-4">
                      {renderExtraFields()}
                    </div>
                  )}
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

export default DynamicEditModal;
