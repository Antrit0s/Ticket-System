import { baseApi } from "../../lib/baseApi";
import type { Asset } from "../../types";

export interface GetAssetsParams {
  userId?: string;
  status?: string;
}

export interface CreateAssetBody {
  name: string;
  serialNumber: string;
  type: string;
  userId: string;
}

export const assetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssets: builder.query<Asset[], GetAssetsParams | void>({
      query: (params) => ({ url: "/assets", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((asset) => ({ type: "Asset" as const, id: asset.id })),
              { type: "Asset" as const, id: "LIST" },
            ]
          : [{ type: "Asset" as const, id: "LIST" }],
    }),

    getAsset: builder.query<Asset, string>({
      query: (assetId) => `/assets/${assetId}`,
      providesTags: (_result, _error, assetId) => [{ type: "Asset", id: assetId }],
    }),

    // New assets start as "assigned".
    createAsset: builder.mutation<Asset, CreateAssetBody>({
      query: (body) => ({
        url: "/assets",
        method: "POST",
        body: { ...body, status: "assigned" },
      }),
      invalidatesTags: [{ type: "Asset", id: "LIST" }],
    }),

    updateAsset: builder.mutation<Asset, { id: string; patch: { name?: string; serialNumber?: string; type?: string; status?: string; userId?: string } }>({
      query: ({ id: assetId, patch }) => ({
        url: `/assets/${assetId}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id: assetId }) => [
        { type: "Asset", id: assetId },
        { type: "Asset", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAssetsQuery,
  useGetAssetQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
} = assetsApi;
