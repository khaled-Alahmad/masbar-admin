"use client"
import { useEffect, useState } from "react";
import { Input, Card, CardBody, Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import { getData, putData } from "@/utils/apiHelper";

export default function SettingsPage() {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await getData("/admin/settings");
                if (response.success) {
                    console.log(response);

                    setSettings(response.data);
                } else {
                    toast.error("Failed to load settings");
                }
            } catch (error) {
                toast.error("Error fetching settings");
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleChange = (id, value) => {
        setSettings((prev) =>
            prev.map((item) => (item.id === id ? { ...item, value } : item))
        );
    };

    const handleSave = async () => {
        try {
            const formattedData = settings.reduce((acc, item) => {
                acc[item.key] = item.value; // Convert array to object
                return acc;
            }, {});

            console.log("Formatted data:", formattedData); // Debugging

            const response = await putData("/admin/settings", formattedData);
            // const data = await response.json();

            if (response.success) {
                toast.success("Settings updated successfully!");
            } else {
                toast.error("Failed to update settings");
            }
        } catch (error) {
            console.log(error);

            toast.error("Error updating settings");
        }
    };


    return (
        <Card className=" mx-auto p-2">
            <CardBody>
                <h2 className="text-xl font-bold mb-6">Settings</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {settings.map(({ id, key, value, type }) => (
                            <Input
                                key={id}
                                variant="bordered"
                                labelPlacement="outside"
                                label={key.replace(/_/g, " ").toUpperCase()}
                                type={type === "int" ? "number" : "text"}
                                value={type === "int" ? value.toLocaleString('en-US') : value}  // Format with commas
                                onChange={(e) => handleChange(id, e.target.value)}
                            />
                        ))}
                        <Button color="primary" className="w-[120px] flex align-middle items-center max-w[100%] justify-center " onClick={handleSave}>
                            Save Changes
                        </Button>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
