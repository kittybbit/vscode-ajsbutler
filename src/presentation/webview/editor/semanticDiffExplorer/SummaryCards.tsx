import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SemanticDiffExplorerViewModel } from "../../../../application/semantic-diff/semanticDiffExplorer";
import {
  semanticDiffExplorerCardLabel,
  type SemanticDiffExplorerLabels,
} from "./semanticDiffExplorerLocalization";

export type SemanticDiffExplorerSummaryCardsProps = Readonly<{
  viewModel: SemanticDiffExplorerViewModel;
  labels: SemanticDiffExplorerLabels;
  language: string;
}>;

export const SemanticDiffExplorerSummaryCards = ({
  viewModel,
  labels,
  language,
}: SemanticDiffExplorerSummaryCardsProps): React.ReactElement => (
  <Box
    component="section"
    aria-label={labels.summaryCards}
    data-semantic-diff-explorer-summary="true"
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))",
      gap: 1.5,
      mb: 2,
    }}
  >
    {viewModel.cards.map((card) => (
      <Card
        component="article"
        variant="outlined"
        key={card.id}
        aria-label={`${semanticDiffExplorerCardLabel(card.id, language)}: ${card.count}`}
        sx={{ minWidth: 0, borderColor: "divider" }}
      >
        <CardContent>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography
              component="h2"
              variant="h6"
              sx={{ overflowWrap: "anywhere" }}
            >
              {semanticDiffExplorerCardLabel(card.id, language)}
            </Typography>
            <Chip size="small" label={card.count} aria-hidden="true" />
          </Stack>
          <Typography
            component="output"
            variant="h4"
            aria-label={`${card.count}`}
          >
            {card.count}
          </Typography>
          <Box component="dl" sx={{ m: 0 }}>
            {Object.entries(card.counts).map(([key, count]) => (
              <Box key={key} sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Typography component="dt" variant="body2">
                  {labels.value(key)}
                </Typography>
                <Typography component="dd" variant="body2" sx={{ m: 0 }}>
                  {count}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
);

export default SemanticDiffExplorerSummaryCards;
