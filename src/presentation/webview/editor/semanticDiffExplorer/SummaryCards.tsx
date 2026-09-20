import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SemanticDiffExplorerViewModel } from "../../../../application/semantic-diff/semanticDiffExplorer";
import ResultCard from "../shared/result/ResultCard";
import ResultKeyValueList from "../shared/result/ResultKeyValueList";
import ResultStatusChip from "../shared/result/ResultStatusChip";
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
      <ResultCard
        key={card.id}
        ariaLabel={`${semanticDiffExplorerCardLabel(card.id, language)}: ${card.count}`}
        sx={{ borderColor: "divider" }}
      >
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
          <ResultStatusChip label={card.count} ariaLabel={`${card.count}`} />
        </Stack>
        <Typography
          component="output"
          variant="h4"
          aria-label={`${card.count}`}
          sx={{ display: "block", my: 1 }}
        >
          {card.count}
        </Typography>
        <ResultKeyValueList
          items={Object.entries(card.counts).map(([key, count]) => ({
            id: key,
            label: labels.value(key),
            value: count,
          }))}
        />
      </ResultCard>
    ))}
  </Box>
);

export default SemanticDiffExplorerSummaryCards;
