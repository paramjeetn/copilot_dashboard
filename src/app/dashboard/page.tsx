"use client"

import React, { useEffect, useState, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import PatientTab from '@/components/PatientTab';
import GuidelineTab from '@/components/GuidelineTab';
import { ScrollArea } from "@/components/ui/scroll-area";

interface Data {
  patient: { [key: string]: string };
  guideline: { [key: string]: string };
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('patients');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<Data>({ patient: {}, guideline: {} });
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedGuidelineId, setSelectedGuidelineId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/unique_ids');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on the active tab and search query
  const filteredData = () => {
    const entries = activeTab === 'patients' ? data.patient : data.guideline;
    return Object.entries(entries).filter(([value]) =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Handle selecting an item from the search results
  const handleSelect = (item: string, key: string) => {
    setSearchQuery(''); // Clear the search query
    setShowResults(false);

    // Set the appropriate ID based on the active tab
    if (activeTab === 'patients') {
      setSelectedPatientId(key);
    } else {
      setSelectedGuidelineId(key);
    }
  };

  // Handle click outside the search results to close the dropdown
  const handleClickOutside = (event: MouseEvent) => {
    if (!searchRef.current?.contains(event.target as Node)) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handle tab change to reset the selected ID accordingly
  useEffect(() => {
    const entries = activeTab === 'patients' ? Object.entries(data.patient) : Object.entries(data.guideline);

    if (entries.length > 0) {
      if (activeTab === 'patients') {
        setSelectedPatientId(entries[0][0]); // Set first patient ID
      } else {
        setSelectedGuidelineId(entries[0][0]); // Set first guideline ID
      }
    } else {
      // Reset selected IDs if no data is present
      if (activeTab === 'patients') {
        setSelectedPatientId(null);
      } else {
        setSelectedGuidelineId(null);
      }
    }
  }, [activeTab, data]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="bg-white dark:bg-gray-800 shadow-sm mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          </TabsList>

          <div ref={searchRef} className="relative">
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              className="max-h-80 p-4 pl-10 text-sm text-gray-700"
              onFocus={() => setShowResults(true)}
            />

            {showResults && (
              <div className="absolute top-12 left-0 w-full bg-white z-50 shadow-md">
                <ScrollArea className="cursor-pointer h-64"> 
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <ul>
                      {filteredData().map(([key, value]) => (
                        <li key={key} onClick={() => handleSelect(value, key)} className="py-2 px-4 hover:bg-gray-100 cursor-pointer">
                          {value} {activeTab === 'patients' && `(${key})`}
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollArea>
              </div>
            )}
          </div>
        </Tabs>
      </header>

      <div className="mt-4">
        {activeTab === 'patients' && (
          <PatientTab selectedItem={selectedPatientId} />
        )}
        {activeTab === 'guidelines' && (
          <GuidelineTab selectedItem={selectedGuidelineId} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
