"use client";

import { type FormEvent, useEffect, useState } from "react";
import { GitTokenDocs } from "@components/system/git-token-docs";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Button } from "@components/ui/button";
import { Card, CardHeader } from "@components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog";
import { FormControl } from "@components/ui/form-control";
import { Input } from "@components/ui/input";
import { magicModal } from "@components/ui/magic-modal";
import { useAsyncAction } from "@hooks/use-async-action";
import { AxiosError } from "axios";
import { Info, Save } from "lucide-react";

type Props = {
    onSaveToken: (token: string, hostUrl: string) => Promise<void>;
};

/**
 * Modal for connecting to a Forgejo/Gitea instance.
 * 
 * Forgejo requires:
 * 1. The host URL of the Forgejo instance (e.g., https://forgejo.example.com)
 * 2. A Personal Access Token with appropriate permissions
 * 
 * Unlike GitHub/GitLab SaaS, Forgejo is always self-hosted, so the host URL is required.
 */
export const ForgejoModal = (props: Props) => {
    const [token, setToken] = useState("");
    const [hostUrl, setHostUrl] = useState("");
    const [error, setError] = useState({ message: "" });

    useEffect(() => {
        setError({ message: "" });
    }, [token, hostUrl]);

    const canSubmit = !!token && !!hostUrl && !error.message;

    const [saveToken, { loading: loadingSaveToken }] = useAsyncAction(
        async () => {
            magicModal.lock();

            try {
                // Ensure the host URL doesn't have a trailing slash
                const normalizedHostUrl = hostUrl.replace(/\/+$/, "");
                await props.onSaveToken(token, normalizedHostUrl);
                magicModal.hide();
            } catch (error) {
                magicModal.unlock();

                if (error instanceof AxiosError && error.status === 400) {
                    setError({ message: "Invalid Token or Host URL" });
                }
            }
        },
    );

    const handleTokenSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canSubmit) return;

        void saveToken();
    };

    return (
        <Dialog open onOpenChange={() => magicModal.hide()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <span>Forgejo / Gitea</span> - New Integration
                    </DialogTitle>
                </DialogHeader>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleTokenSubmit}>
                    <Alert variant="info" className="mb-4">
                        <Info />
                        <AlertTitle>Token Authentication</AlertTitle>
                        <AlertDescription>
                            Forgejo uses token-based authentication. Reviews
                            will be published using your profile.
                        </AlertDescription>
                    </Alert>

                    <Card color="lv1">
                        <CardHeader className="flex flex-col gap-4">
                            <FormControl.Root>
                                <FormControl.Label htmlFor="forgejo-host">
                                    Forgejo/Gitea Instance URL
                                </FormControl.Label>

                                <FormControl.Input>
                                    <Input
                                        id="forgejo-host"
                                        type="url"
                                        value={hostUrl}
                                        onChange={(e) =>
                                            setHostUrl(e.target.value)
                                        }
                                        placeholder="https://forgejo.example.com"
                                    />
                                </FormControl.Input>

                                <FormControl.Helper>
                                    The URL of your Forgejo or Gitea instance
                                </FormControl.Helper>
                            </FormControl.Root>

                            <FormControl.Root>
                                <FormControl.Label htmlFor="forgejo-token">
                                    Personal Access Token
                                </FormControl.Label>

                                <FormControl.Input>
                                    <Input
                                        id="forgejo-token"
                                        type="password"
                                        value={token}
                                        error={error.message}
                                        onChange={(e) =>
                                            setToken(e.target.value)
                                        }
                                        placeholder="Enter your Personal Access Token"
                                    />

                                    <FormControl.Error>
                                        {error.message}
                                    </FormControl.Error>
                                </FormControl.Input>

                                <FormControl.Helper>
                                    Create a token with <code>read:user</code>,{" "}
                                    <code>read:organization</code>,{" "}
                                    <code>repository</code>, and <code>write:issue</code> permissions
                                </FormControl.Helper>
                            </FormControl.Root>
                        </CardHeader>
                    </Card>

                    <Alert variant="default" className="text-sm">
                        <AlertDescription>
                            <strong>Required Token Permissions:</strong>
                            <ul className="mt-2 list-inside list-disc">
                                <li>
                                    <code>read:user</code> - Read user profile
                                    information (required for authentication)
                                </li>
                                <li>
                                    <code>read:repository</code> - Read access
                                    to repositories
                                </li>
                                <li>
                                    <code>write:repository</code> - Create
                                    webhooks for PR events
                                </li>
                                <li>
                                    <code>write:issue</code> - Create and update
                                    pull request comments
                                </li>
                            </ul>
                        </AlertDescription>
                    </Alert>

                    <DialogFooter>
                        <Button
                            size="md"
                            type="submit"
                            variant="primary"
                            loading={loadingSaveToken}
                            leftIcon={<Save />}
                            disabled={!canSubmit}>
                            Validate and save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
