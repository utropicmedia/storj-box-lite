import { Bucket } from "@aws-sdk/client-s3";
import { faArrowsAltV, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox, Transition } from "@headlessui/react";
import { StorjClient } from "lib/storjClient";
import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSettings } from "store/settings/settingsSlice";
import Spinner from "./Spinner";

export default function BucketSelector(): ReactElement {
  const [selected, setSelected] = useState<Bucket>();
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const settings = useSelector(selectSettings);

  useEffect(() => {
    async function getBuckets() {
      const { auth } = settings;
      const storjClient = StorjClient.getInstance(auth);
      const listBucketsResponse = await storjClient?.listBuckets();
      if (
        listBucketsResponse &&
        listBucketsResponse.Buckets &&
        listBucketsResponse.Buckets.length > 0
      ) {
        setBuckets(listBucketsResponse.Buckets);
        setSelected(listBucketsResponse.Buckets[0]);
      }
    }
    if (
      settings &&
      settings.auth &&
      settings.auth.accessKeyId &&
      settings.auth.secretAccessKey
    ) {
      getBuckets();
    }
  }, [settings]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          {settings && (
            <div className="relative mt-1 w-full md:w-1/2">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                {buckets.length === 0 && <Spinner />}
                {buckets.length > 0 && selected && (
                  <>
                    <span className="block truncate">{selected.Name}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <FontAwesomeIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                        icon={faArrowsAltV}
                      />
                    </span>
                  </>
                )}
              </Listbox.Button>
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                {buckets.length && (
                  <Listbox.Options
                    static
                    className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  >
                    {buckets.map((bucket, bucketIdx) => (
                      <Listbox.Option
                        key={bucketIdx}
                        className={({ active }) =>
                          `${
                            active
                              ? "text-blue-900 bg-blue-100"
                              : "text-gray-900"
                          }
                      cursor-default select-none relative py-2 pl-10 pr-4`
                        }
                        value={bucket}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`${
                                selected ? "font-medium" : "font-normal"
                              } block truncate`}
                            >
                              {bucket.Name}
                            </span>
                            {selected ? (
                              <span
                                className={`${
                                  active ? "text-amber-600" : "text-amber-600"
                                }
                            absolute inset-y-0 left-0 flex items-center pl-3`}
                              >
                                <FontAwesomeIcon
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                  icon={faCheck}
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                )}
              </Transition>
            </div>
          )}
        </>
      )}
    </Listbox>
  );
}